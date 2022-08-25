import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseMigration1661400650327 implements MigrationInterface {
  name = 'BaseMigration1661400650327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tags\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`movies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`overview\` text NOT NULL, \`poster\` varchar(255) NOT NULL, \`play_until\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`is_admin\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`movies_tags_tags\` (\`moviesId\` int NOT NULL, \`tagsId\` int NOT NULL, INDEX \`IDX_5ca2153346a50348cec77c3201\` (\`moviesId\`), INDEX \`IDX_21863da94b41f8391153dfef95\` (\`tagsId\`), PRIMARY KEY (\`moviesId\`, \`tagsId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movies_tags_tags\` ADD CONSTRAINT \`FK_5ca2153346a50348cec77c32013\` FOREIGN KEY (\`moviesId\`) REFERENCES \`movies\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movies_tags_tags\` ADD CONSTRAINT \`FK_21863da94b41f8391153dfef953\` FOREIGN KEY (\`tagsId\`) REFERENCES \`tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`movies_tags_tags\` DROP FOREIGN KEY \`FK_21863da94b41f8391153dfef953\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`movies_tags_tags\` DROP FOREIGN KEY \`FK_5ca2153346a50348cec77c32013\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_21863da94b41f8391153dfef95\` ON \`movies_tags_tags\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5ca2153346a50348cec77c3201\` ON \`movies_tags_tags\``,
    );
    await queryRunner.query(`DROP TABLE \`movies_tags_tags\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`movies\``);
    await queryRunner.query(`DROP TABLE \`tags\``);
  }
}
