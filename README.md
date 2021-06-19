## NHttp Validator
Body validator for [Deno](https://deno.land/) [nhttp](https://github.com/nhttp/nhttp) based on [class-validator](https://github.com/typestack/class-validator).

> for complete doc, please visit [class-validator](https://github.com/typestack/class-validator).

## Installation
### deno.land
```ts
import { validate } from "https://deno.land/x/nhttp_validator@0.1.0/mod.ts";
```

### nest.land
```ts
import { validate } from "https://x.nest.land/nhttp_validator@0.1.0/mod.ts";
```

## Usage
```ts
import { NHttp } from "https://deno.land/x/nhttp@0.2.4/mod.ts";
import { 
    IsString, 
    IsEmail, 
    IsPhoneNumber, 
    validate 
} from "https://deno.land/x/nhttp_validator@0.1.0/mod.ts";

// class-validator person
class Person {
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsPhoneNumber()
    phone!: string;
}

const app = new NHttp();

app.post("/person", validate(Person), ({ response, body }) => {
    response.send(body);
});

app.listen(3000);
```

## Error Message 
If not valid throw error with status 422 (Unprocessable Entity).
```ts
{
    "status": 422,
    "message": [
        {
            "target": {},
            "property": "name",
            "children": [],
            "constraints": {
                "isString": "name must be a string"
            }
        },
        {
            "target": {},
            "property": "email",
            "children": [],
            "constraints": {
                "isEmail": "email must be an email"
            }
        },
        {
            "target": {},
            "property": "phone",
            "children": [],
            "constraints": {
                "isPhoneNumber": "phone must be a valid phone number"
            }
        }
    ],
    "name": "UnprocessableEntityError",
    "stack": [...]
}
```

## Run
```bash
deno run --allow-net --allow-read --unstable yourfile.ts
```
## Throw
Change throw error.
```js
...
app.post("/person", validate(Person, { throw: BadRequestError }), ({ response, body }) => {
    response.send(body);
});
...
```
## Featuring NHttp Controller
```js
import { 
    NHttp, 
    RequestEvent 
} from "https://deno.land/x/nhttp@0.2.4/mod.ts";

import { 
    IsString, 
    IsEmail, 
    IsPhoneNumber, 
    Validate 
} from "https://deno.land/x/nhttp_validator@0.1.0/mod.ts";

import { 
    addControllers, 
    Controller, 
    Post
} from "https://deno.land/x/nhttp_controller@0.2.0/mod.ts";

// class-validator person
class Person {
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsPhoneNumber()
    phone!: string;
}

// Person Controller
@Controller("/person")
class PersonController {

    @Validate(Person)
    @Post()
    save({ body }: RequestEvent) {
        return body;
    }
}

const app = new NHttp();

app.use(addControllers([PersonController]))

app.listen(3000);

```

## License

[MIT](LICENSE)