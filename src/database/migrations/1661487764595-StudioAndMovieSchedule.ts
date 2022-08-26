import { MigrationInterface, QueryRunner } from 'typeorm';

export class StudioAndMovieSchedule1661487764595 implements MigrationInterface {
  name = 'StudioAndMovieSchedule1661487764595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`studios\` (\`id\` int NOT NULL AUTO_INCREMENT, \`studio_number\` int NOT NULL, \`seat_capacity\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`movie_schedules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`start_time\` varchar(255) NOT NULL, \`end_time\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`date\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`movieId\` int NULL, \`studioId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movie_schedules\` ADD CONSTRAINT \`FK_8bda8a64eca5ffd7532f9c565e7\` FOREIGN KEY (\`movieId\`) REFERENCES \`movies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movie_schedules\` ADD CONSTRAINT \`FK_4bc40302a0a4356ef0849f1bbfa\` FOREIGN KEY (\`studioId\`) REFERENCES \`studios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`movie_schedules\` DROP FOREIGN KEY \`FK_4bc40302a0a4356ef0849f1bbfa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`movie_schedules\` DROP FOREIGN KEY \`FK_8bda8a64eca5ffd7532f9c565e7\``,
    );
    await queryRunner.query(`DROP TABLE \`movie_schedules\``);
    await queryRunner.query(`DROP TABLE \`studios\``);
  }
}
