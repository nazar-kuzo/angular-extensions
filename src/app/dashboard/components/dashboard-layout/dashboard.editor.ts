import { BaseEditor, DayOfWeek, Field, Option } from "angular-extensions";

export class DashboardEditor extends BaseEditor {

  public firstName: Field<string>;

  public lastName: Field<string>;

  public dayOfBirth: Field<DayOfWeek>;

  constructor() {
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

    this.dayOfBirth = new Field({
      label: "Day of Birth",
      validation: {
        required: { value: true }
      },
      options: Option.ForEnum(DayOfWeek),
    });

    super.initialize();
  }
}
