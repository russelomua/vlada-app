export class UserModel {
    id?: number;
    login?: string;
    name?: string;
    password?: string;
    surname?: string;
    adress?: string;
    avatar?: string;
    rule?: string;
    email?: string;

    checkUser() {
        return (this.login && this.name && this.password && this.email);
    }
}
