import { type ChangeEvent } from "react";

function UploadImage() {
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      formData.append("file", target.files[0]);
    }

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Colonies counted:", data);
  };

  return (
    <input type="file" onChange={handleUpload} />
  );
}

export default UploadImage;
