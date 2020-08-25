/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Utility methods for reading files.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */

/**
 * Read a file and invoke callback.
 * @param {*} file File to read
 * @param {*} callback Callback to be invoked when file has been read
 */
export const readFile = async (file, callback) => {
  const reader = new FileReader();
  reader.onload = async (event) => {
    callback({
      result: event.target.result,
      file
    });
  };

  if (file) {
    reader.readAsDataURL(file); // Base64 encoded
  }
};
