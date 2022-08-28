import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseMigration1661694193050 implements MigrationInterface {
  name = 'BaseMigration1661694193050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`is_admin\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`payment_method\` varchar(255) NOT NULL, \`total_item_price\` double NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`price\` double NOT NULL, \`sub_total_price\` double NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`orderId\` int NULL, \`movieScheduleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`studios\` (\`id\` int NOT NULL AUTO_INCREMENT, \`studio_number\` int NOT NULL, \`seat_capacity\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`movie_schedules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`start_time\` varchar(255) NOT NULL, \`end_time\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`date\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`movieId\` int NULL, \`studioId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`movies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`overview\` text NOT NULL, \`poster\` varchar(255) NOT NULL, \`play_until\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tags\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`now_playing_movies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`overview\` text NOT NULL, \`release_date\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`movies_tags_tags\` (\`moviesId\` int NOT NULL, \`tagsId\` int NOT NULL, INDEX \`IDX_5ca2153346a50348cec77c3201\` (\`moviesId\`), INDEX \`IDX_21863da94b41f8391153dfef95\` (\`tagsId\`), PRIMARY KEY (\`moviesId\`, \`tagsId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_f1d359a55923bb45b057fbdab0d\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_265e220ef8d3fa3d117687ca21e\` FOREIGN KEY (\`movieScheduleId\`) REFERENCES \`movie_schedules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movie_schedules\` ADD CONSTRAINT \`FK_8bda8a64eca5ffd7532f9c565e7\` FOREIGN KEY (\`movieId\`) REFERENCES \`movies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movie_schedules\` ADD CONSTRAINT \`FK_4bc40302a0a4356ef0849f1bbfa\` FOREIGN KEY (\`studioId\`) REFERENCES \`studios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`movie_schedules\` DROP FOREIGN KEY \`FK_4bc40302a0a4356ef0849f1bbfa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`movie_schedules\` DROP FOREIGN KEY \`FK_8bda8a64eca5ffd7532f9c565e7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_265e220ef8d3fa3d117687ca21e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_f1d359a55923bb45b057fbdab0d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_21863da94b41f8391153dfef95\` ON \`movies_tags_tags\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5ca2153346a50348cec77c3201\` ON \`movies_tags_tags\``,
    );
    await queryRunner.query(`DROP TABLE \`movies_tags_tags\``);
    await queryRunner.query(`DROP TABLE \`now_playing_movies\``);
    await queryRunner.query(`DROP TABLE \`tags\``);
    await queryRunner.query(`DROP TABLE \`movies\``);
    await queryRunner.query(`DROP TABLE \`movie_schedules\``);
    await queryRunner.query(`DROP TABLE \`studios\``);
    await queryRunner.query(`DROP TABLE \`order_items\``);
    await queryRunner.query(`DROP TABLE \`orders\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
