import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config_Constants_Enum } from '../enum/api-config.enum';

@Injectable()
export class ApiConfigServices {
  constructor(private readonly configService: ConfigService) {}

  getPort() {
    return this.configService.get(Config_Constants_Enum.PORT) || 5500;
  }

  getVersion() {
    return this.configService.get(Config_Constants_Enum.VERSION) || '1.0';
  }

  getMongooseConnection() {
    return (
      this.configService.get(Config_Constants_Enum.MONGOOSE_CONNECTION) || ''
    );
  }

  getClientDomain() {
    return (
      this.configService.get(Config_Constants_Enum.CLIENT_DOMAIN) ||
      'http://localhost:4400'
    );
  }

  getEmailService() {
    return {
      host:
        this.configService.get(Config_Constants_Enum.SEND_EMAIL_HOST) ||
        'smtp.gmail.com',
      authEmailUser: this.configService.get(
        Config_Constants_Enum.AUTH_EMAIL_USER,
      ),
      authEmailPassword: this.configService.get(
        Config_Constants_Enum.AUTH_EMAIL_PASSWORD,
      ),
      defaultMailFrom: this.configService.get(
        Config_Constants_Enum.DEFAULT_MAIL_FROM,
      ),
    };
  }

  getSecretKey() {
    return this.configService.get(Config_Constants_Enum.SECRET_KEY);
  }

  getBearerTokenExpireTime() {
    return {
      accessTokenExpire: this.configService.get(
        Config_Constants_Enum.ACCESS_TOKEN_EXPIRE,
      ),
      refreshTokenExpire: this.configService.get(
        Config_Constants_Enum.REFRESH_TOKEN_EXPIRE,
      ),
    };
  }

  getGoogleOAuthKeys() {
    return {
      clientId: this.configService.get(Config_Constants_Enum.GOOGLE_CLIENT_ID),
      clientSecret: this.configService.get(
        Config_Constants_Enum.GOOGLE_CLIENT_SECRET,
      ),
    };
  }
}
