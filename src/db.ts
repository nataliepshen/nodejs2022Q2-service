import { Global, Injectable, Module } from "@nestjs/common";
import { Track } from "./tracks/entities/track.entity";
import { User } from "./users/entities/user.entity";

@Injectable()
export class InMemoryDB {
    users: User[] = [];
    tracks: Track[] = [];
}

@Global()
@Module({
    providers: [InMemoryDB],
    exports: [InMemoryDB],
})

export class InMemoryDBModule {};