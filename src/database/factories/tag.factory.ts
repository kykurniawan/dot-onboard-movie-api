import { Tag } from '../../../src/modules/movie/entities/tag.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Tag, (faker) => {
  const tag = new Tag();
  tag.name = faker.color.human();
  return tag;
});
