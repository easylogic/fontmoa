class ActivationCore {
  
    install (file) {

    }

    uninstall (file) {

    }


    active (file) {

    }

    deactive (file) {

    }        

    toggleActive (file, isActive) {
        if (isActive) {
            this.active(file);
        } else {
            this.deactive(file);
        }
    }
}

export default ActivationCore