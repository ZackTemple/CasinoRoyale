import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-resend-confirmation-email',
  templateUrl: './resend-confirmation-email.component.html',
  styleUrls: ['./resend-confirmation-email.component.css']
})
export class ResendConfirmationEmailComponent implements OnInit {

  username: string;
  confirmationSent = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onClickResendEmailConfirmation(): void {
    // call returns true if user could be logged in
    this.authService.resendConfirmationCode(this.username);
    this.confirmationSent = true;
  }

}
