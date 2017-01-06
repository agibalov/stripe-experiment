package me.loki2302;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

public class AppSignInRequestDto {
    @NotEmpty
    @Email
    public String email;
}
