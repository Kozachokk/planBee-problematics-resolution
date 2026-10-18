export interface IUser{
    userId: number,
    username: string,
    isAdmin: boolean,
    canCreateProblems: boolean,
}

export interface IUserContext{
    user?: IUser,
    loginUser: (user:IUser) => void
}