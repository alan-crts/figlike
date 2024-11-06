import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Color from "../settings/Color";

type ButtonStylesProps = {
  attribute: any;
  handleInputChange: (property: string, value: string) => void;
  inputRef: any;
};

const ButtonStyles = ({
  attribute,
  handleInputChange,
  inputRef,
}: ButtonStylesProps) => {
  return (
    <div className='flex flex-col gap-3 border-b border-primary-grey-200 px-5 py-3'>
      <h3 className='text-[10px] uppercase'>Style du Bouton</h3>

      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <Label className='text-xs'>Texte du bouton</Label>
          <Input
            type='text'
            onChange={(e) => handleInputChange("buttonText", e.target.value)}
            value={attribute.buttonText}
            className='w-full'
            placeholder='Texte du bouton'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Label className='text-xs'>Couleur de fond</Label>
          <Color
            attribute={attribute.backgroundColor}
            placeholder='Couleur de fond'
            attributeType='backgroundColor'
            handleInputChange={handleInputChange}
            inputRef={inputRef}
          />
        </div>

        <div className='flex items-center gap-2'>
          <Label className='text-xs'>Couleur du texte</Label>
          <Color
            inputRef={inputRef}
            attribute={attribute.textColor}
            placeholder='Couleur du texte'
            attributeType='textColor'
            handleInputChange={handleInputChange}
          />
        </div>

        <div className='flex items-center gap-2'>
          <Label className='text-xs'>Rayon de bordure</Label>
          <Input
            type='number'
            value={attribute.borderRadius}
            onChange={(e) => handleInputChange("borderRadius", e.target.value)}
            className='w-20'
            min={0}
          />
        </div>
      </div>
    </div>
  );
};

export default ButtonStyles;
