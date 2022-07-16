import { Global, Injectable, Module } from "@nestjs/common";
import { User } from "./users/entities/user.entity";

@Injectable()
export class InMemoryDB {
    users: User[] = [];
}

@Global()
@Module({
    providers: [InMemoryDB],
    exports: [InMemoryDB],
})

export class InMemoryDBModule {};