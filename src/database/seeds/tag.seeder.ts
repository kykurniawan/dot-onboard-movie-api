import { Seeder, Factory } from 'typeorm-seeding';
import { Tag } from '../../modules/movie/entities/tag.entity';

export default class TagSeeder implements Seeder {
  async run(factory: Factory) {
    await factory(Tag)().createMany(10);
  }
}
