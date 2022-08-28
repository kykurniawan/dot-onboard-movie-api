import { define } from 'typeorm-seeding';
import { Tag } from '../../modules/movie/entities/tag.entity';
import { faker } from '@faker-js/faker';

define(Tag, () => {
  const tag = new Tag();
  tag.name = faker.random.word();
  return tag;
});
