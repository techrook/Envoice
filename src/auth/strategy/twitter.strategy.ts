import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      consumerKey: configService.get('TWITTER_CONSUMER_KEY'),
      consumerSecret: configService.get('TWITTER_CONSUMER_SECRET'),
      callbackURL: configService.get('TWITTER_CALLBACK_URL'),
      includeEmail: true,
    });
  }

  async validate(
    token: string,
    tokenSecret: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const { id, emails, displayName } = profile;
    const user = {
      provider: 'twitter',
      providerId: id,
      email: emails ? emails[0].value : null,
      displayName,
      token,
    };
    done(null, user);
  }
}
