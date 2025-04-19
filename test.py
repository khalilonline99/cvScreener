import torch

print(torch.__version__)
print(torch.cuda.is_available())  # Should return True
print(torch.version.cuda)  # Should match your installed CUDA version
print(f"CUDA Version: {torch.version.cuda}")
print(f"Is bfloat16 supported on CUDA: {torch.cuda.is_bf16_supported()}")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"GPU Compute Capability: {torch.cuda.get_device_capability(device)}")
