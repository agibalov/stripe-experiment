package me.loki2302;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

public class AppSignUpRequestDto {
    @NotEmpty
    @Email
    public String email;

    @NotEmpty
    public String token;

    @NotEmpty
    public String plan;
}
