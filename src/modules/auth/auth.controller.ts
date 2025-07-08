import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegistrationDto } from './dto/registration.dto'
import { Response } from 'express'
import { LocalAuthGuard } from '../../common/guards/local.guard'
import { RequestWithUser } from '../../common/interfaces/request-user.interface'
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { Public } from 'src/common/decorators/is-public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('registration')
  async registration(@Body() registrationDto: RegistrationDto, @Res() res: Response) {
    const tokens = await this.authService.registration(registrationDto)
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
    })
    return res.status(201).json({ message: 'Вы успешно зарегистрировались', accessToken: tokens.accessToken })
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    const tokens = await this.authService.login(req.user)
    res.clearCookie('refreshToken')
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
    })
    return res.status(201).json({ message: 'Вы успешно авторизованы', accessToken: tokens.accessToken })
  }

  @Post('logout')
  async logout(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken')
    await this.authService.logout(req.user.id)
    return { message: 'Вы успешно вышли из системы' }
  }

  @UseGuards(JwtRefreshGuard)
  @Public()
  @Get('refresh')
  async refresh(@Req() req: RequestWithUser, @Res() res: Response) {
    const tokens = await this.authService.refresh(req.user)
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
    })
    return res.status(200).json({ accessToken: tokens.accessToken })
  }
}
