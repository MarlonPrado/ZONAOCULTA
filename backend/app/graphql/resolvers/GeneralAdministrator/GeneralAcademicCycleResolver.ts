import { connectionFromArraySlice } from 'graphql-relay';
import { ObjectId } from 'mongodb';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { GeneralAcademicCycleRepository, UserRepository } from '../../../servers/DataSource';
import { removeEmptyStringElements } from '../../../types';
import { NewGeneralAcademicCycle } from '../../inputs/GeneralAdministrator/NewGeneralAcademicCycle';
import { IContext } from '../../interfaces/IContext';
import {
  GeneralAcademicCycle,
  GeneralAcademicCycleConnection
} from '../../models/GeneralAdministrator/GeneralAcademicCycle';
import { User } from '../../models/GeneralAdministrator/User';
import { ConnectionArgs } from '../../pagination/relaySpecs';

@Resolver(GeneralAcademicCycle)
export class GeneralAcademicCycleResolver {
  @InjectRepository(GeneralAcademicCycle)
  private repository = GeneralAcademicCycleRepository;

  @InjectRepository(User)
  private repositoryUser = UserRepository;

  @Query(() => GeneralAcademicCycle, { nullable: true })
  async getGeneralAcademicCycle(@Arg('id', () => String) id: string) {
    const result = await this.repository.findOneBy(id);
    return result;
  }

  @Query(() => GeneralAcademicCycleConnection)
  async getAllGeneralAcademicCycle(
    @Args() args: ConnectionArgs,
    @Arg('allData', () => Boolean) allData: Boolean,
    @Arg('orderCreated', () => Boolean) orderCreated: Boolean
  ): Promise<GeneralAcademicCycleConnection> {
    let result;
    if (allData) {
      if (orderCreated) {
        result = await this.repository.findBy({
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.find();
      }
    } else {
      if (orderCreated) {
        result = await this.repository.findBy({
          where: {
            active: true,
          },
          order: { createdAt: 'DESC' },
        });
      } else {
        result = await this.repository.findBy({
          where: {
            active: true,
          },
        });
      }
    }
    let resultConn = new GeneralAcademicCycleConnection();
    let resultConnection = connectionFromArraySlice(result, args, {
      sliceStart: 0,
      arrayLength: result.length,
    });
    resultConn = { ...resultConnection, totalCount: result.length };
    return resultConn;
  }

  @Mutation(() => GeneralAcademicCycle)
  async createGeneralAcademicCycle(
    @Arg('data') data: NewGeneralAcademicCycle,
    @Ctx() context: IContext
  ): Promise<GeneralAcademicCycle> {
    let dataProcess: NewGeneralAcademicCycle = removeEmptyStringElements(data);
    let createdByUserId = context?.user?.authorization?.id;
    const model = await this.repository.create({
      ...dataProcess,
      active: true,
      version: 0,
      createdByUserId,
    });
    let result = await this.repository.save(model);
    return result;
  }

  @Mutation(() => GeneralAcademicCycle)
  async updateGeneralAcademicCycle(
    @Arg('data') data: NewGeneralAcademicCycle,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<GeneralAcademicCycle | null> {
    let dataProcess = removeEmptyStringElements(data);
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      ...dataProcess,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    return result;
  }

  @Mutation(() => Boolean)
  async changeActiveGeneralAcademicCycle(
    @Arg('active', () => Boolean) active: boolean,
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let updatedByUserId = context?.user?.authorization?.id;
    let result = await this.repository.findOneBy(id);
    result = await this.repository.save({
      _id: new ObjectId(id),
      ...result,
      active: active,
      version: (result?.version as number) + 1,
      updatedByUserId,
    });
    if (result.id) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async deleteGeneralAcademicCycle(
    @Arg('id', () => String) id: string,
    @Ctx() context: IContext
  ): Promise<Boolean | null> {
    let data = await this.repository.findOneBy(id);
    let result = await this.repository.deleteOne({ _id: new ObjectId(id) });
    return result?.result?.ok === 1 ?? true;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async createdByUser(@Root() data: GeneralAcademicCycle) {
    let id = data.createdByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }

  @FieldResolver((_type) => User, { nullable: true })
  async updatedByUser(@Root() data: GeneralAcademicCycle) {
    let id = data.updatedByUserId;
    if (id !== null && id !== undefined) {
      const result = await this.repositoryUser.findOneBy(id);
      return result;
    }
    return null;
  }
}
