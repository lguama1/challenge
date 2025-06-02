
export class ToastService {

 public static setToast (type: string, title: string, desc: string): void {
    const toast = document.getElementById('toastSaved') as HTMLSpAtToastElement;
    if(!toast) return;

    Object.assign(toast, {
      type,
      titleToast: title,
      textDesc: desc
    });
    toast.show();
  };
}
