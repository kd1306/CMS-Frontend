import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  
  signupForm!: FormGroup;
  password = true;
  confirmPassword = true;
  responseMessage:any;

  nameControl!: FormControl;
  contactNumber!: FormControl;
  email!: FormControl;
  passwordControl!: FormControl;
  confirmPasswordControl!: FormControl;

  constructor(private formBuilder:FormBuilder, 
    private router:Router, 
    private userService:UserService,
    private snackBarService:SnackbarService,
    public dialogRef:MatDialogRef<SignupComponent>,
    private ngxService:NgxUiLoaderService
    ) {}
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null,[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    })
  
    this.nameControl = this.signupForm.get('name') as FormControl;
    this.contactNumber = this.signupForm.get('contactNumber') as FormControl;
    this.email = this.signupForm.get('email') as FormControl;
    this.passwordControl = this.signupForm.get('password') as FormControl;
    this.confirmPasswordControl = this.signupForm.get('confirmPassword') as FormControl;
  }

  validateSubmit() {
    if(this.passwordControl.value != this.confirmPasswordControl.value) {
      return true;
    } else {
      return false;
    }
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }

    this.userService.signup(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackBarService.openSnackBar(this.responseMessage,"");
      this.router.navigate(['/']);
    }, (error)=>{
      this.ngxService.stop();
      if(error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

}
