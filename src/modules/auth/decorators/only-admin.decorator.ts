import { SetMetadata } from '@nestjs/common';

export const OnlyAdmin = () => SetMetadata('only', 'admin');
