import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger: Logger = new Logger();

	public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		const recordTime = Date.now(); //kirish fazasi vaqti
		const requestType = context.getType<GqlContextType>(); //req. type ni aniqlash un (Rest api yoki GraphQL mi) sababi AppModule bizda 2 ta apidan foydalanilgan (rest api (controller bor) va graphql (resolver bor))

		if (requestType === 'http') {
			/**Develop if needed!*/
		} else if (requestType === 'graphql') {
			/**(1) Print Request */
			const gqlContext = GqlExecutionContext.create(context);
			this.logger.log(`Type ${this.stringify(gqlContext.getContext().req.body)}`, 'REQUEST');

			/** (2)  Errors via GraphQL*/

			/** (2)  NO Errors, giving Response below*/
			return next.handle().pipe(
				tap((context) => {
					const responseTime = Date.now() - recordTime;
					this.logger.log(`${this.stringify(context)} - ${responseTime}ms \n\n`, 'RESPONSE');
				}), //chiqish fazasi vaqti
			);
		}
	}

	private stringify(context: ExecutionContext): string {
		return JSON.stringify(context).slice(0, 75);
	}
}

// Buni develop qilishda, yani req. kelayotgan va res. chiqayotgan datalarni datalarni  yahshiroq log qilishda, Callhandler pkg kk buladi.

//Standard Logging:
/** export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		console.log('Before...'); //kirish fazasi

		const now = Date.now();
		return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`))); //chiqish fazasi
	}
}*/
