# eslint-plugin-test-no-throw

lint

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-test-no-throw`:

```sh
npm install eslint-plugin-test-no-throw --save-dev
```

## Usage

Add `test-no-throw` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "test-no-throw"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "test-no-throw/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


