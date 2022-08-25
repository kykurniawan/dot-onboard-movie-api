import { Tag } from '../../../src/modules/movie/entities/tag.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class TagSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const tagFactory = await factoryManager.get(Tag);
    await tagFactory.saveMany(10);
  }
}
