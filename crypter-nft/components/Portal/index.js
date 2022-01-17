import { createPortal } from "react-dom";
import styles from "../Modal/Modal.module.sass";
import Icon from "../Icon";
import OutsideClickHandler from "react-outside-click-handler";
import cn from "classnames";

const Portal = ({
    visible,   
    outerClassName,
    containerClassName, 
    onClose,
    children
}) => {
    return createPortal(
        visible && (
          <div className={styles.modal} id="modal">
            <div className={cn(styles.outer, outerClassName)}>
              <OutsideClickHandler onOutsideClick={onClose}>
                <div className={cn(styles.container, containerClassName)}>
                  {children}
                  <button className={styles.close} onClick={onClose}>
                    <Icon name="close" size="14" />
                  </button>
                </div>
              </OutsideClickHandler>
            </div>
          </div>
        ),
        document.body
      );
}

export default Portal;