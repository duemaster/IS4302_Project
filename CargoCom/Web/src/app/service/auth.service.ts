import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingService} from "./setting/setting.service";
import {BlockChainService} from "./blockchain/block-chain.service";

@Injectable()
export class AuthService {

    public admin: any;
    public user_profile: any;

    constructor(private http: HttpClient,
                public setting: SettingService,
                public blockChainService: BlockChainService) {
        let adminStorage = localStorage.getItem('admin');
        if (adminStorage != null) {
            this.admin = JSON.parse(adminStorage);
            this.loadUserProfile(this.admin.id);
        }
        console.log(this.admin);
    }

    async login(userName: string, password: string) {
        try {
            this.admin = await this.http.post(
                `${this.setting.ENDPOINT}/user/login`,
                {name: userName, password: password},
                {withCredentials: true}
            ).toPromise();

            //Save in Cookie
            localStorage.setItem("admin", JSON.stringify(this.admin));
            await this.loadUserProfile(this.admin.id);
            return true;
        } catch (e) {
            return false;
        }
    }

    async logout() {
        await this.http.post(
            `${this.setting.ENDPOINT}/user/logout`,
            this.admin,
            {withCredentials: true}
        ).toPromise();

        localStorage.removeItem("admin");
        this.admin = null;
        this.user_profile = null;
    }

    public async loadUserProfile(userId: string) {
        this.user_profile = await this.http.get(
            `${this.setting.ENDPOINT}/blockchain/user/${userId}/api/org.airline.airChain.${this.setting.participantType}/${userId}`,
            {withCredentials: true}
        ).toPromise();

        //remove namespace
        this.user_profile.company = this.user_profile.company.replace(
            `${this.blockChainService.CARGO_COMPANY}#`,
            ""
        );
    }
}
