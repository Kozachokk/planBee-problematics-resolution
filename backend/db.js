import Database from "better-sqlite3";

const db = new Database("db.db");

const createUserTable = db.prepare("CREATE TABLE IF NOT EXISTS user(" +
"userId INTEGER PRIMARY KEY," +
"username TEXT UNIQUE NOT NULL," +
"password TEXT NOT NULL," +
"isAdmin INTEGER NOT NULL DEFAULT 0 CHECK (isAdmin IN (0, 1))," +
"canCreateProblems INTEGER NOT NULL DEFAULT 0 CHECK (canCreateProblems IN (0, 1))," +
"refreshToken TEXT NOT NULL," +
"accessToken TEXT NOT NULL" +
"" +
");");

const createProblemTable = db.prepare("CREATE TABLE IF NOT EXISTS problem(" +
"problemId INTEGER PRIMARY KEY," +
"problem TEXT NOT NULL UNIQUE," +
"createdBy INTEGER NOT NULL REFERENCES user(userId)" +
");");

const createSolutionTable = db.prepare("CREATE TABLE IF NOT EXISTS solution(" +
"solutionId INTEGER PRIMARY KEY," +
"solution TEXT NOT NULL," +
"proposedBy INTEGER NOT NULL REFERENCES user(userId)," +
"problemId INTEGER NOT NULL REFERENCES problem(problemId)" +
");");

const createSolutionUserFeedbackBridgingTable = db.prepare("CREATE TABLE IF NOT EXISTS solution_user(" +
"solutionId INTEGER REFERENCES solution(solutionId)," +
"userId INTEGER REFERENCES user(userId)," +
"opinion INTEGER NOT NULL DEFAULT 0 CHECK (opinion IN (-1, 0, 1))," +
"PRIMARY KEY (solutionId, opinion)" +
");");

createUserTable.run();
createProblemTable.run();
createSolutionTable.run();
createSolutionUserFeedbackBridgingTable.run();

const authenticateUserQuery = db.prepare("SELECT userId FROM user WHERE username = ? AND password = ?");


const authenticateUser = (username, password) => {
    const result = authenticateUserQuery.get(username, password);
    
    return result.userId;
}

export { authenticateUser }