import test from "node:test";
import assert from "node:assert/strict";
import {
  imageUpload,
  videoUpload,
  audioUpload,
  imageReducerUpload,
} from "../controllers/upload.controller.js";

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test("upload handlers reject missing file payloads with 400", async () => {
  for (const handler of [imageUpload, videoUpload, audioUpload, imageReducerUpload]) {
    const res = createMockRes();
    await handler({ files: null }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
  }
});

test("upload handlers reject unsupported extensions with 400", async () => {
  const checks = [
    [imageUpload, "imageFile", "payload.exe"],
    [videoUpload, "videoFile", "clip.txt"],
    [audioUpload, "audioFile", "sound.pdf"],
    [imageReducerUpload, "imageFile", "doc.svg"],
  ];

  for (const [handler, fieldName, fileName] of checks) {
    const res = createMockRes();
    await handler({ files: { [fieldName]: { name: fileName } } }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
  }
});

