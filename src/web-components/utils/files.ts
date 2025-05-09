/**
 * Encodes content in a file with the given filename and then triggers a download of the file.
 * @param {string} filename - The name of the file to be created and downloaded.
 * @param {string} content - The content to put in the created file.
 */
export function downloadFile(filename: string, content: string) {
  // create the file
  const file = new File(['\ufeff' + content], filename, {
    type: 'text/plain:charset=UTF-8',
  });
  // create a ObjectURL for downloading the file
  const url = window.URL.createObjectURL(file);
  // create a hidden link and set the href to the file URL
  const link = document.createElement('a');
  link.style = 'display: none';
  link.href = url;
  link.download = file.name;
  // "click" the hidden link
  link.click();
  // clean up
  link.remove();
  window.URL.revokeObjectURL(url);
}
