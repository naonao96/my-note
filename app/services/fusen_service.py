"""
このファイルはサービス層です。
Routesから呼び出され、アプリケーションのビジネスロジックを担当します。
Repositoryを利用してデータの取得・更新を行い、
ModelとDTOの変換も担当します。
"""
from app.repositories.fusen_repo  import FusenRepository
from app.dto.fusen_data import FusenData
from app.models.fusen_model import Fusen
from app.validators.fusen_validator import vld_content
import app.common.util as util
import app.common.messages as msg

class FusenService:
    def __init__(self):
        self.note_repo : FusenRepository = FusenRepository()

    def fusen_create(self, fusen_data : FusenData) -> dict:
        vld_res : dict = vld_content(fusen_data.content)
        if not vld_res.get("success"):
            return vld_res
        dto:FusenData= FusenData()
        success: bool = self.note_repo.create(dto.to_model(fusen_data))
        
        return util.res_msg_pack(success, "")
    
    def fusen_all_read(self) -> list:
        fusen_list_model : list[Fusen] = self.note_repo.read_all_fusen()
        fusen_list : list[FusenData] = []
        if (not fusen_list_model):
            return []
        for model in fusen_list_model:
            dto : FusenData = FusenData.from_model(model)
            fusen_list.append(dto)
        
        return fusen_list
    
    def fusen_read(self, note_id : int) -> FusenData | None:
        model : Fusen = self.note_repo.read_fusen(note_id)
        if (model is None):
            return None
        
        return FusenData.from_model(model)
    
    def fusen_update(self, fusen_data : FusenData) -> dict:
        vld_res : dict = vld_content(fusen_data.content)
        if not vld_res.get("success"):
            return vld_res
        dto:FusenData= FusenData()
        success : bool = self.note_repo.update(FusenData.to_model(dto))

        return util.res_msg_pack(success, "")
    
    def fusen_delete(self, note_id : int) -> dict:
        success : bool = self.note_repo.delete(note_id)
        if not success:
            return util.res_msg_pack(success, msg.FUSEN_DATA_DELETE_ERROR)

        return util.res_msg_pack(success, "")
    

