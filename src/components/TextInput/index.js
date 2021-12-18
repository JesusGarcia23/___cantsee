import React from "react";
import cn from "classnames";
import styles from "./TextInput.module.sass";

const TextInput = ({ className, label, setValue, name, ...props }) => {
  return (
    <div className={cn(styles.field, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        <input
          className={styles.input}
          {...props}
          onChange={(event) => setValue(event.target.value)}
          value={name}
        />
      </div>
    </div>
  );
};

export default TextInput;
