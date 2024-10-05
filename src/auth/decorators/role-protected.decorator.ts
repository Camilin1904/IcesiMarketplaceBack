import { SetMetadata } from "@nestjs/common"

export const RoleProtected = (...roles: string[]) =>
{
    return SetMetadata('roles', roles);
}