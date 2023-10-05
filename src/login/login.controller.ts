import { 
    Body,
    Controller,
    Get,
    Post,
    Request,
    Res} from '@nestjs/common';
import { LoginService } from './login.service';
import { login_post_schema } from './dto/login_post_schema.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {Response} from 'express';


@ApiTags('Login')
@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService){}
   
    @Post()
    @ApiResponse({status: 401, description: 'Incorrect CPF or Password!'})
    @ApiResponse({status: 400, description: 'Malformed request. Check the sent data.'})
    @ApiResponse({status: 422, description: 'Validation Problem.'})
    async peformLogin(@Body() loginDto: login_post_schema, @Res({passthrough: true}) res: Response){
        const login = await this.loginService.generateToken(loginDto)
        res.set{'Authorization', login.token}
        return this.loginService.validateUser(loginDto)
    }

    @ApiBearerAuth()
    @Get()
    @ApiResponse({status: 401, description: 'User not logged in!'})
    @ApiResponse({status: 403, description: 'Access forbidden for this user.'})
    async loggedUser(@Request() req): Promise <any>{
        return req.user;
    }
}