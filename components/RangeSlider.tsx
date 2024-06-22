'use client'
import React, { useState } from 'react'
import { Slider } from "antd";

interface RangeType {
  setRangeValue:(value:number[]) => void;
}

 export const RangeSlider:React.FC<RangeType> = ({setRangeValue}) => {
      const [values, setValues] = useState<number[]>([39, 1230])
      const onChangeComplete = (value: number[]) => { 
        setValues(value)
        setRangeValue(value)
      };

  return (
    <div>
      <Slider
         range
         min={39}
         max={1500}
         step={1}
         defaultValue={values}
        onChangeComplete={onChangeComplete}
    />
    <div>
        <p>
            <span className='text-[15px] leading-[16px]'>Price:</span>
            <span className='font-semibold text-[#46A358] ml-2'>{Array.isArray(values)? values[0] : values}$ -</span>
            <span className='font-semibold text-[#46A358] ml-1'>{Array.isArray(values)? values[values.length -1] : values}$</span>
        </p>
    </div>
    </div>
  )
}

export default RangeSlider