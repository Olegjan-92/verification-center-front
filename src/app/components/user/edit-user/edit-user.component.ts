import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InnService } from '../../../services/inn.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {

  errorMessage = '';

  userForm = new FormGroup({
    login: new FormControl(this.data.user.login, []),
    password: new FormControl(this.data.user.password, []),
    confirmPassword: new FormControl(this.data.user.confirmPassword, []),
    surName: new FormControl(this.data.user.surName, []),
    firstName: new FormControl(this.data.user.firstName, []),
    lastName: new FormControl(this.data.user.lastName, [])
  });

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private innService: InnService) {
  }

  save() {
    this.clearErrMessage();
    if (this.userForm.get('login').value && this.userForm.get('surName').value &&
      this.userForm.get('firstName').value && this.userForm.get('lastName').value &&
      this.userForm.get('password').value && this.userForm.get('confirmPassword').value) {

      const password = this.userForm.get('password').value;
      const confirmPassword = this.userForm.get('confirmPassword').value;

      if (!this.innService.isValidInn(this.userForm.get('login').value)) {
        this.errorMessage = 'Введен некорректный ИНН';
        return;
      }
      if (password !== confirmPassword) {
        this.errorMessage = 'Пароли не совпадают';
        return;
      }
      this.data.user.login = this.userForm.get('login').value;
      this.data.user.surName = this.userForm.get('surName').value;
      this.data.user.firstName = this.userForm.get('firstName').value;
      this.data.user.lastName = this.userForm.get('lastName').value;
      this.data.user.password = this.userForm.get('password').value;
      this.dialogRef.close(this.data.user);
    }
  }

  cancel() {
    this.clearErrMessage();
    this.dialogRef.close();
  }

  clearErrMessage() {
    this.errorMessage = '';
  }
}
