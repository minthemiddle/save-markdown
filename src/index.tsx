import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { readFileSync, writeFileSync, promises as fsPromises } from 'fs';
import { join } from 'path';
import { customAlphabet } from 'nanoid'

type Values = {
  textfield: string;
  textarea: string;
  tokeneditor: string[];
};

export default function Command() {

  function syncWriteFile(filename: string, data: any) {
    writeFileSync(filename, data, {
      flag: 'w',
    });

    const contents = readFileSync(filename, 'utf-8');
  console.log(contents);

  return contents;
  };


  function handleSubmit(values: Values) {

    let template = readFileSync("/Users/martinbetz/Library/Mobile Documents/27N4MQEA55~pro~writer/Documents/_Posteingang/.template.md").toString();
    let { render } = require("mustache");
    const moment = require('moment');
    let timestamp = moment().format('YYMMDDHHmm');
    let created_at = moment().format('YYYY-MM-DD, HH:mm');

    const nanoid = customAlphabet('346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz', 8)
    values['id'] = nanoid(); //=> "4f90d13a42"
    values['timestamp'] = timestamp;
    values['created_at'] = created_at;

    if ( values['work'] === true ) {
      values['tag'] = 'visable';
    }

    else {
      values['tag'] = values['tag_other'];
    }

    let output = render(template, values);
    console.log(moment().format('YYMMDDHHmm'));
    console.log(output);
    console.log(values);

    syncWriteFile(`/Users/martinbetz/Library/Mobile Documents/27N4MQEA55~pro~writer/Documents/_Posteingang/${timestamp}-${values['title']}.md`, output);
    showToast({ title: "Saved text", message: "See logs for submitted values" });
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save text" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" placeholder="Enter title" />
      <Form.TextArea id="body" title="Body" enableMarkdown={true} placeholder="Enter body" />
      <Form.Checkbox id="work" label="Work related?" />
      <Form.TextField id="tag_other" title="Tag" placeholder="Other tag" />
    </Form>
  );
}
