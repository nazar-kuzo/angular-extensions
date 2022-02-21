import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseEditor, DayOfWeek, Field, Option } from "angular-extensions";
import { map } from "rxjs/operators";

interface Country {

  cca3: string;

  name: { common: string };
}

@Injectable()
export class DashboardEditor extends BaseEditor {

  public firstName: Field<string>;

  public lastName: Field<string>;

  public dayOfBirth: Field<DayOfWeek, Option<DayOfWeek>>;

  public coutry: Field<Country>;

  constructor(
    private api: HttpClient,
  ) {
    super();

    this.firstName = new Field({
      label: "First Name",
      validation: {
        required: { value: true },
        maxLength: { value: () => this.lastName.value?.length || 10, text: "First Name cannot be longer than the Last Name" }
      },
    });

    this.lastName = new Field({
      label: "Last Name",
      validation: {
        required: { value: true }
      },
    });

    this.dayOfBirth = new Field<DayOfWeek, Option<DayOfWeek>>({
      label: "Day of Birth",
      validation: {
        required: { value: true }
      },
      options: Option.ForEnum<DayOfWeek>(DayOfWeek),
    });

    this.coutry = new Field<Country, Country>({
      label: "Country",
      validation: {
        required: { value: true }
      },
      optionId: country => country.cca3,
      optionLabel: country => country.name.common,
      onValueChange: country => {
        if (country.name.common == "Poland") {
          throw new Error("You cannot select Poland");
        }

        console.error(country.name.common);
      },
      options: this.api
        .get<Country[]>(
          `https://restcountries.com/v3.1/all`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            },
            observe: "response",
            responseType: "json",
          })
        .pipe(map(response => response.body || [])),
      optionsProvider: query => {
        return this.api
          .get<Country[]>(
            `https://restcountries.com/v3.1/name/${query}`,
            {
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              observe: "response",
              responseType: "json",
            })
          .pipe(map(response => response.body || []));
      },
    });

    super.initialize();
  }
}
