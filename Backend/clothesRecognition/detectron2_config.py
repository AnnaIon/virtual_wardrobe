# backend/detectron2_config.py
import os
from detectron2.data.datasets import register_coco_instances
from detectron2.config import get_cfg

def register_modanet_datasets():
    data_dir = os.path.join(os.getcwd(), "data")
    train_json = os.path.join(data_dir, "moda_train_coco.json")
    val_json = os.path.join(data_dir, "moda_val_coco.json")
    # If the file_name fields are relative, set the images URL base.
    # For example, if images are hosted at "https://modanet.example.com/images/"
    # you might want to update the JSON (or do it on the fly in your custom mapper).
    # Here we assume the JSON has full URLs.
    register_coco_instances("modanet_train", {}, train_json, "")
    register_coco_instances("modanet_val", {}, val_json, "")
    print("ModaNet datasets registered.")

def setup_config(num_classes=13):
    cfg = get_cfg()
    config_file = "detectron2/configs/COCO-InstanceSegmentation/mask_rcnn_R_50_FPN_3x.yaml"
    cfg.merge_from_file(config_file)
    cfg.DATASETS.TRAIN = ("modanet_train",)
    cfg.DATASETS.TEST = ("modanet_val",)
    cfg.DATALOADER.NUM_WORKERS = 2

    # Update for your number of classes (check the annotations for the correct count)
    cfg.MODEL.ROI_HEADS.NUM_CLASSES = num_classes

    cfg.SOLVER.IMS_PER_BATCH = 2
    cfg.SOLVER.BASE_LR = 0.00025
    cfg.SOLVER.MAX_ITER = 10000  # Adjust iterations as needed
    cfg.OUTPUT_DIR = os.path.join(os.getcwd(), "output_modanet")
    os.makedirs(cfg.OUTPUT_DIR, exist_ok=True)
    
    return cfg

if __name__ == "__main__":
    register_modanet_datasets()
    cfg = setup_config()
    print("Configuration is set up.")
