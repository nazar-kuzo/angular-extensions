import { HttpClient } from "@angular/common/http";
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

  public phone: Field<string>;

  public dateOfBirth: Field<Date>;

  public dateTimeOfBirth: Field<Date>;

  public timeOfBirth: Field<Date>;

  public dayOfBirth: Field<DayOfWeek, Option<DayOfWeek>>;

  public coutry: Field<Country>;

  public image: Field<File[]>;

  public allies: Field<Country[], Country>;

  public anthem: Field<string>;

  public isOfficial: Field<boolean>;

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

    this.phone = new Field({
      label: "Phone",
      validation: {
        required: { value: true }
      },
    });

    this.dateOfBirth = new Field<Date>({
      label: "Date of Birth",
      validation: {
        required: { value: true }
      },
    });

    this.dateTimeOfBirth = new Field<Date>({
      label: "Date/Time of Birth",
      validation: {
        required: { value: true }
      },
    });

    this.timeOfBirth = new Field<Date>({
      label: "Time of Birth",
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

    this.image = new Field<File[]>({
      label: "Image",
      validation: {
        required: { value: true }
      }
    });

    this.coutry = new Field<Country, Country>({
      label: "Country",
      info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." +
        "Ut lacus metus, molestie sed mi non, accumsan molestie elit.",
      validation: {
        required: { value: true }
      },
      optionId: country => country.cca3,
      optionLabel: country => country.name.common,
      onValueChange: country => {
        console.error(`Selected country: ${country?.name.common}`);
      },
      options: this.loadAllCountries(),
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

    this.allies = new Field<Country[], Country>({
      label: "Allies",
      validation: {
        required: { value: true }
      },
      optionId: country => country.cca3,
      optionLabel: country => country.name.common,
      options: this.loadAllCountries(),
      value: [],
      onValueChange: allies => {
        console.error(`Selected allies: ${allies.map(country => country.name.common).join(", ")}`);
      },
    });

    this.anthem = new Field({
      label: "Anthem",
      validation: {
        required: { value: true },
      },
    });

    this.isOfficial = new Field({
      label: "Is official",
    });

    super.initialize();
  }

  public reloadControls() {
    this.dayOfBirth.options = [...this.dayOfBirth.options];

    this.coutry.setOptions(this.loadAllCountries());
    this.allies.setOptions(this.loadAllCountries());
  }

  private loadAllCountries() {
    return this.api
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
      .pipe(map(response => response.body || []));
  }
}
