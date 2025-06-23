# Angular Extensions

A curated collection of extensions and utilities that simplify and enhance Angular application development.

## ✨ Features

### 🧱 Reactive Forms Enhancements
- **Field / Form Classes**: Simplified API for managing Angular Reactive Forms.
- Cleaner validation logic and form control abstractions.
- Strongly-typed helpers to reduce boilerplate.

### 🧩 Common Editor Controls
- Prebuilt, reusable components based on **Angular Material** and **CDK**.
- Includes commonly-used form inputs and UI controls.
- Consistent UX patterns out of the box.

### 🚦 Router Extensions
- **Stateful Modals**: Manage modals as part of router state.
- **Route Retained Events**: Listen to route changes even when components are reused.
- Useful hooks and utilities for advanced routing behavior.

## 📦 Installation

```bash
npm install angular-extensions
````

> Make sure to also install `@angular/material` and `@angular/cdk` if you intend to use the UI controls.

## 🛠️ Usage

### Reactive Forms

```ts
import { Field, FormGroupBuilder } from 'angular-extensions/forms';

const loginForm = new FormGroupBuilder({
  email: new Field('', [Validators.required, Validators.email]),
  password: new Field('', Validators.required),
});
```

### Router Extensions

```ts
import { ModalRouteService } from 'angular-extensions/router';

modalRouteService.open('settings');
```

## 📚 Documentation

Detailed usage examples and API reference can be found in the [Wiki](https://github.com/your-org/angular-extensions/wiki) *(or replace with a `/docs` folder link if applicable)*.

## 🧪 Development

Clone the repo and run:

```bash
npm install
npm run start
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.
