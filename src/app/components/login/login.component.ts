import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EditUserComponent } from '../user/edit-user/edit-user.component';
import { UserModel } from '../user/shared/user-model';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../shared/message/message.component';
import { InnService } from '../../services/inn.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';
  returnUrl = '/';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private innService: InnService
  ) {
    if (this.authService.getToken()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.clearErrMessage();
    if (this.loginForm.invalid) {
      return;
    }
    const login = this.loginForm.controls.login.value;
    if (!this.innService.isValidInn(login)) {
      this.errorMessage = 'Введен некорректный ИНН';
      this.loginForm.reset();
      return;
    }
    this.isLoading = true;
    this.authService.login(this.loginForm.controls.login.value, this.loginForm.controls.password.value).subscribe(
      data => {
        this.isLoading = false;
        localStorage.setItem('token', JSON.stringify(data));
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.isLoading = false;
        this.loginForm.reset();
        if (error.status === 403) {
          this.loginForm.reset();
          this.errorMessage = 'Ошибка при вводе ИНН или пароля';
        } else {
          console.log(error);
          // this.dialog.open(MessageComponent, {
          //   width: '450px',
          //   data: {data: error}
          // });
        }
      });
  }

  register() {
    this.clearErrMessage();
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '450px',
      data: {user: new UserModel(), register: true}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.authService.register(result).subscribe((user: UserModel) => {
          this.isLoading = false;
          this.dialog.open(MessageComponent, {
            width: '450px',
            data: {status: 'Поздравляем', message: 'Пользователь успешно зарегестрирован!'}
          });
        }, error => {
          this.isLoading = false;
          this.dialog.open(MessageComponent, {
            width: '450px',
            data: {status: 'Ошибка', message: 'При регистрации произошла ошибка, попробуйте еще раз!'}
          });
        });
      }
    });
  }

  clearErrMessage() {
    this.errorMessage = '';
  }
}
