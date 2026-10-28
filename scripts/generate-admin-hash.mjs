import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);

function hiddenInput(prompt) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY || !process.stdin.setRawMode) {
      reject(new Error('Ejecuta este comando en una terminal interactiva.'));
      return;
    }
    process.stderr.write(prompt);
    let value = '';
    process.stdin.setRawMode(true);
    process.stdin.setEncoding('utf8');
    process.stdin.resume();
    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener('data', onData);
      process.stderr.write('\n');
    };
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === '\u0003' || char === '\u0004') { cleanup(); reject(new Error('Operación cancelada.')); return; }
        if (char === '\r' || char === '\n') { cleanup(); resolve(value); return; }
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
        else if (char >= ' ' && value.length < 512) value += char;
      }
    };
    process.stdin.on('data', onData);
  });
}

try {
  const password = await hiddenInput('Nueva contraseña (mínimo 16 caracteres; entrada oculta): ');
  if (password.length < 16 || password.length > 256) throw new Error('Usa entre 16 y 256 caracteres.');
  const confirmation = await hiddenInput('Repite la contraseña: ');
  if (password !== confirmation) throw new Error('Las contraseñas no coinciden.');
  const salt = randomBytes(24).toString('hex');
  const key = await scrypt(password, salt, 64);
  process.stdout.write(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${key.toString('hex')}\n`);
  process.stderr.write('Guarda el hash en tu entorno local y en Vercel. La contraseña no se ha guardado.\n');
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : 'No se pudo generar el hash.'}\n`);
  process.exitCode = 1;
}
