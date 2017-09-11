class ActivationCore {
  
    install (file) {
        // NOOP
    }

    uninstall (file) {
        // NOOP
    }


    active (file) {
        // NOOP
    }

    deactive (file) {
        // NOOP
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