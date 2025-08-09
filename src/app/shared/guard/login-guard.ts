import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { CommonService } from '../services/common-service';

@Injectable({ providedIn: 'root' })
export class loginGuard implements CanActivate {
  constructor(private commonService: CommonService) { }

  canActivate(): boolean {
    this.commonService.urlLogout();
    return true;
  }
}
