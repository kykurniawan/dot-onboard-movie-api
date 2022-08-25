import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTables1661327539690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userTable = new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          isNullable: false,
        },
        {
          name: 'name',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'email',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'password',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'avatar',
          type: 'varchar',
          length: '255',
          isNullable: false,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'deleted_at',
          type: 'timestamp',
          isNullable: true,
        },
      ],
    });
    await queryRunner.createTable(userTable, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
