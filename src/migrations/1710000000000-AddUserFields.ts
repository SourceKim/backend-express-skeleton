import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUserFields1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("users", [
            new TableColumn({
                name: "nickname",
                type: "varchar",
                length: "100",
                isNullable: true
            }),
            new TableColumn({
                name: "phone",
                type: "varchar",
                length: "20",
                isNullable: true,
                isUnique: true
            }),
            new TableColumn({
                name: "avatar",
                type: "varchar",
                length: "255",
                isNullable: true
            }),
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ["active", "inactive", "banned"],
                default: "'active'"
            }),
            new TableColumn({
                name: "bio",
                type: "varchar",
                length: "500",
                isNullable: true
            }),
            new TableColumn({
                name: "merit_points",
                type: "int",
                default: 0
            }),
            new TableColumn({
                name: "meditation_minutes",
                type: "int",
                default: 0
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("users", [
            "nickname",
            "phone",
            "avatar",
            "status",
            "bio",
            "merit_points",
            "meditation_minutes"
        ]);
    }
} 