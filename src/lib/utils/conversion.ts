// Encode alphanumeric string into binary string
function binary(str: string) {
  const zeroPad = (num: string) => {
    return '00000000'.slice(String(num).length) + num;
  };

  return str.replace(/[\s\S]/g, function (str: any) {
    str = zeroPad(str.charCodeAt().toString(2));
    return str;
  });
}

// Decode binary string into alphanumeric string
function alphanumeric(str: string) {
  // Removes the spaces from the binary string
  str = str.replace(/\s+/g, '');
  // Pretty (correct) print binary (add a space every 8 characters)
  str = str.match(/.{1,8}/g)!.join(' ');

  var binString = '';

  str.split(' ').map(function (bin: string) {
    binString += String.fromCharCode(parseInt(bin, 2));
  });

  return binString;
}

export { binary, alphanumeric };
