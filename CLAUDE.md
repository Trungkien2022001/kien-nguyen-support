# CLAUDE.md

Hướng dẫn cho Claude Code khi làm việc trong repo này.

## Package

- Name: `@kien2k1/multi-channel-alert`
- Registry: https://www.npmjs.com/package/@kien2k1/multi-channel-alert
- Entry point: `index.js`
- Node.js support: v8.0.0+ (giữ tương thích legacy — KHÔNG dùng `Promise.allSettled`, optional chaining, nullish coalescing, v.v.)

## Release workflow

Mỗi khi bump version (ví dụ v1.0.X → v1.0.Y), chạy đúng trình tự sau:

1. **Bump version**: sửa `package.json` (`version`) và `README.md` (dòng `**Version:**` ở section Package Information).
2. **Cập nhật README**:
   - Thêm/cập nhật section `### ✨ What's New in vX.Y.Z` ngay dưới Package Information.
   - Thêm entry vào `## Version History` (giữ theo thứ tự mới nhất trên cùng, kèm ngày).
3. **Commit**: theo style hiện tại của repo:
   ```
   chore: release vX.Y.Z - <one-line summary>

   - feat(...): ...
   - chore(...): ...
   - docs: ...
   ```
   Không kèm `Co-Authored-By` trailer.
4. **Tag**: `git tag vX.Y.Z` (lightweight tag, prefix `v`, khớp version trong package.json).
5. **Push commit lên main + tag + branch release**:
   ```bash
   # 5a. Push commit lên main
   git push origin main

   # 5b. Push tag (lightweight tag không đi kèm --follow-tags)
   git push origin vX.Y.Z

   # 5c. Tạo branch release dựa trên version và push lên remote
   git branch release/vX.Y.Z       # tạo từ HEAD hiện tại (commit release)
   git push -u origin release/vX.Y.Z
   ```
   Branch `release/vX.Y.Z` giữ snapshot của từng release để dễ hotfix sau này mà không đụng `main`.
6. **Publish npm** (sau khi đã push xong):
   ```bash
   npm whoami            # check login state
   npm login             # nếu chưa login (interactive — user tự chạy)
   npm publish --access public --otp=<6-digit-code>  # npm yêu cầu OTP từ authenticator
   ```

## Conventions

- **Commit message**: tiếng Anh, prefix `chore:` cho release, `feat(scope):` / `fix(scope):` / `docs:` / `chore(scope):` cho bullets.
- **Pre-commit hook**: husky v4 + lint-staged → `eslint --fix` trên `*.js`. Cần `node_modules` đã cài. Nếu thiếu thì chạy `npm install` trước, KHÔNG dùng `--no-verify` trừ khi user yêu cầu rõ.
- **package-lock.json**: KHÔNG stage vào release commit (giữ commit release sạch, chỉ chứa source + docs).
- **CommonJS only**: file dùng `require` / `module.exports`. Bỏ qua TS hint `80001` ("may be converted to ES module").

## Constants

`constants/index.js` chứa shared constants. Ví dụ Telegram:
- `TELEGRAM.API_BASE_URL`
- `TELEGRAM.MAX_MESSAGE_LENGTH = 4096` (Telegram `sendMessage` cap)
- `TELEGRAM.PRODUCTS`, `TELEGRAM.ERROR_TYPES`, `TELEGRAM.POLLING`

## Telegram alert

- Khi `parse_mode=Markdown` mà cắt message giữa chừng phải đóng lại code fence `` ``` `` còn dang dở — Telegram trả 400 nếu fence không cân bằng.
- Stack trace cắt còn 2 dòng đầu để gọn.
- Thread routing: `messageThreadIds[service][type][action]` → fallback `.all` → fallback `general`.
